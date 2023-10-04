var sayHello = func(names, favorite) {
  foreach (var name; names) {
    printf("Hello %s, %s is the best!", name, favorite);
  }
}

sayHello(["World", "FlightGear"], "Nasal");
