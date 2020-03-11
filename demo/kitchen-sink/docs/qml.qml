// A simple example
import QtQuick 2.7
import QtQuick.Controls 2.3

Rectangle {
    color: "red"
    anchors.fill: parent

    Text {
        text: "WEEEEEEEEEE"
        font.pixelSize: 50
        color: "white"
        anchors.centerIn: parent
        RotationAnimator on rotation {
            running: true
            loops: Animation.Infinite
            from: 0
            to: 360
            duration: 1500
        }
    }
}
