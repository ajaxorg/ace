/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.02;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

function KeySpline() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;

    this.sampleValues = new Array(KeySpline.splineTableSize);
}

KeySpline.splineTableSize = 11;
KeySpline.sampleStepSize = 1.0 / (KeySpline.splineTableSize - 1);

KeySpline.a = function(a1, a2) {
    return 1.0 - 3.0 * a2 + 3.0 * a1;
};

KeySpline.b = function(a1, a2) {
    return 3.0 * a2 - 6.0 * a1;
};

KeySpline.c = function(a1) {
    return 3.0 * a1;
};

KeySpline.calcBezier = function(t, a1, a2) {
    // use Horner's scheme to evaluate the Bezier polynomial
    return ((KeySpline.a(a1, a2)*t + KeySpline.b(a1, a2))*t + KeySpline.c(a1))*t;
};

KeySpline.getSlope = function(t, a1, a2) {
    return 3.0 * KeySpline.a(a1, a2)*t*t + 2.0 * KeySpline.b(a1, a2) * t + KeySpline.c(a1);
};

(function() {

    this.init = function(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        if (x1 != y1 || x2 != y2) {
            this.calcSampleValues();
        }
    };

    this.calcSampleValues = function() {
        for (var i = 0; i < KeySpline.splineTableSize; i++) {
            this.sampleValues[i] = KeySpline.calcBezier(i * KeySpline.splineTableSize, this.x1, this.x2);
        }
    };

    this.getSplineValue = function(x) {
        if (this.x1 == this.y1 && this.x2 == this.y2)
            return x;
        return KeySpline.calcBezier(this.getTForX(x), this.y1, this.y2);
    };

    this.getSplineDerivativeValues = function(x) {
        var t = this.getTForX(x);
        return {
            dx: KeySpline.getSlope(t, this.x1, this.x2),
            dy: KeySpline.getSlope(t, this.y1, this.y2)
        };
    };

    this.getTForX = function(x) {
        // Find interval where t lies
        var intervalStart = 0.0;
        var currentSampleIndex = 1;
        var lastSampleIndex = KeySpline.splineTableSize - 1;
        for (; currentSampleIndex < lastSampleIndex && this.sampleValues[currentSampleIndex] <= x; currentSampleIndex++) {
            intervalStart += KeySpline.sampleStepSize;
        }
        currentSampleIndex--; // t now lies between *currentSample and *currentSample+1
        // Interpolate to provide an initial guess for t
        var dist = (x - this.sampleValues[currentSampleIndex]) / (this.sampleValues[currentSampleIndex + 1] - this.sampleValues[currentSampleIndex]);

        var guessForT = intervalStart + dist * KeySpline.sampleStepSize;
        // Check the slope to see what strategy to use. If the slope is too small
        // Newton-Raphson iteration won't converge on a root so we use bisection
        // instead.
        var initialSlope = KeySpline.getSlope(guessForT, this.x1, this.x2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return this.newtonRaphsonIterate(x, guessForT);
        } else if (initialSlope === 0) {
            return guessForT;
        } else {
            return this.binarySubdivide(x, intervalStart, intervalStart + KeySpline.sampleStepSize);
        }
    };

    this.newtonRaphsonIterate = function(x, guessT) {
        // Refine guess with Newton-Raphson iteration
        for (var i = 0; i < NEWTON_ITERATIONS; i++) {
            // We're trying to find where f(t) = x,
            // so we're actually looking for a root for: CalcBezier(t) - x
            var currentX = KeySpline.calcBezier(guessT, this.x1, this.x2) - x;
            var currentSlope = KeySpline.getSlope(guessT, this.x1, this.x2);
            if (currentSlope === 0)
                return guessT;
            guessT -= currentX / currentSlope;
        }
        return guessT;
    };

    this.binarySubdivide = function(x, a, b) {
        var currentX;
        var currentT;
        var i = 0;
        do {
            currentT = a + (b - a) / 2.0;
            currentX = KeySpline.calcBezier(currentT, this.x1, this.x2) - x;
            if (currentX > 0) {
                b = currentT;
            } else {
                a = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    };

}).call(KeySpline.prototype);


var currentVelocityWeighting = 0.25;
var stopDecelerationWeighting = 0.4;

function Scroll() {
    this.isSmoothScroll = false;
    this.startTime = 0;
    this.startPos = null;
    this.destination = null;
    this.duration = 0;
    this.origin = null;
    this.originMinMS = 0;
    this.originMaxMS = 0;
    this.intervalRatio = 0;
    // prevStartTime holds previous 3 timestamps for intervals averaging (to
    // reduce duration fluctuations). When AsyncScroll is constructed and no
    // previous timestamps are available (indicated with isFirstIteration),
    // initialize prevStartTime using imaginary previous timestamps with maximum
    // relevant intervals between them.
    this.prevStartTime = new Array(3);
    this.isFirstIteration = true;
    this.timingFunctionX = new KeySpline();
    this.timingFunctionY = new KeySpline();
}

(function() {

    this.initDuration = function(origin) {
        if (this.isFirstIteration || origin != this.origin) {
            this.origin = origin;
            this.originMinMS = this.originMaxMS = 0;
            var isOriginSmoothnessEnabled = false;
            //var defaultMinMS = 150, defaultMaxMS = 150;
            var defaultMinMS = 200, defaultMaxMS = 400;
            var defaultIsSmoothEnabled = true;

            isOriginSmoothnessEnabled = defaultIsSmoothEnabled;
            if (isOriginSmoothnessEnabled) {
                this.originMinMS = defaultMinMS;
                this.originMaxMS = defaultMaxMS;
            }
            // Keep the animation duration longer than the average event intervals
            // (to "connect" consecutive scroll animations before the scroll comes to a stop).
            //var kDefaultDurationToIntervalRatio = 2; // Duplicated at all.js
            this.intervalRatio = 2;
            // Duration should be at least as long as the intervals -> ratio is at least 1
            if (this.isFirstIteration) {
                // Starting a new scroll (i.e. not when extending an existing scroll animation),
                // create imaginary prev timestamps with maximum relevant intervals between them.
                this.isFirstIteration = false;
                // Longest relevant interval (which results in maximum duration)
                var maxDelta = this.originMaxMS / this.intervalRatio;
                this.prevStartTime[0] = this.startTime - maxDelta;
                this.prevStartTime[1] = this.prevStartTime[0] - maxDelta;
                this.prevStartTime[2] = this.prevStartTime[1] - maxDelta;
            }
        }
        // Average last 3 delta durations (rounding errors up to 2ms are negligible for us)
        var eventsDeltaMs = (this.startTime - this.prevStartTime[2]) / 3;
        this.prevStartTime[2] = this.prevStartTime[1];
        this.prevStartTime[1] = this.prevStartTime[0];
        this.prevStartTime[0] = this.startTime;
        // Modulate duration according to events rate (quicker events -> shorter durations).
        // The desired effect is to use longer duration when scrolling slowly, such that
        // it's easier to follow, but reduce the duration to make it feel more snappy when
        // scrolling quickly. To reduce fluctuations of the duration, we average event
        // intervals using the recent 4 timestamps (now + three prev -> 3 intervals).
        var durationMS = Math.min(Math.max(eventsDeltaMs * this.intervalRatio, this.originMinMS), this.originMaxMS);
        this.duration = durationMS;
    };

    this.initSmoothScroll = function(time, currentPos, currentVelocity, destination, origin, range) {
        this.isSmoothScroll = true;
        this.startTime = time;
        this.startPos = currentPos;
        this.destination = destination;
        this.initDuration(origin);
        this.initTimingFunction(this.timingFunctionX, this.startPos.x, currentVelocity.width, this.destination.x);
        this.initTimingFunction(this.timingFunctionY, this.startPos.y, currentVelocity.height, this.destination.y);
    };

    this.isFinished = function(time) {
        return time > this.startTime + this.duration;
    };

    this.progressAt = function(time) {
        return Math.max(Math.min((time - this.startTime) / this.duration, 1), 0);
    };

    this.positionAt = function(time) {
        var progressX = this.timingFunctionX.getSplineValue(this.progressAt(time));
        var progressY = this.timingFunctionY.getSplineValue(this.progressAt(time));
        return {
            x: /*NSToCoordRound*/((1 - progressX) * this.startPos.x + progressX * this.destination.x),
            y: /*NSToCoordRound*/((1 - progressY) * this.startPos.y + progressY * this.destination.y)
        };
    };

    this.velocityAt = function(time) {
        var timeProgress = this.progressAt(time);
        return {
            width: this.velocityComponent(timeProgress, this.timingFunctionX, this.startPos.x, this.destination.x),
            height: this.velocityComponent(timeProgress, this.timingFunctionY, this.startPos.y, this.destination.y)
        };
    };

    this.velocityComponent = function(timeProgress, timingFunction, start, destination) {
        var derivativeValues = timingFunction.getSplineDerivativeValues(timeProgress);
        var dt = derivativeValues.dx;
        var dxy = derivativeValues.dy;

        if (dt === 0)
            return dxy >= 0 ? Infinity : -Infinity;
        var slope = dxy / dt;
        return /*NSToCoordRound*/(slope * (destination - start) / (this.duration / 1000));
    };

    this.initTimingFunction = function(timingFunction, currentPos, currentVelocity, destination) {
        if (destination == currentPos || currentVelocityWeighting === 0) {
            timingFunction.init(0, 0, 1 - stopDecelerationWeighting, 1);
            return;
        }

        var slope = currentVelocity * (this.duration / 1000) / (destination - currentPos);
        var normalization = Math.sqrt(1.0 + slope * slope);
        var dt = 1.0 / normalization * currentVelocityWeighting;
        var dxy = slope / normalization * currentVelocityWeighting;
        timingFunction.init(dt, dxy, 1 - stopDecelerationWeighting, 1);
    };

}).call(Scroll.prototype);

exports.Scroll = Scroll;
});
