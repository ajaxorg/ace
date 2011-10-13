//http://groovy.codehaus.org/Concurrency+with+Groovy
import java.util.concurrent.atomic.AtomicInteger

def counter = new AtomicInteger()

synchronized out(message) {
    println(message)
}

def th = Thread.start {
    for( i in 1..8 ) {
        sleep 30
        out "thread loop $i"
        counter.incrementAndGet()
    }
}

for( j in 1..4 ) {
    sleep 50
    out "main loop $j"
    counter.incrementAndGet()
}

th.join()

assert counter.get() == 12