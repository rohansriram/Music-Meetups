class connection {

    constructor(wid,topic,name,subtitle,details,venue,date,time,people){
      this.workshopId = wid;
      this.topic = topic;
      this.name = name;
      this.subtitle = subtitle;
      this.details = details;
      this.venue = venue;
      this.date = date;
      this.time = time;
      this.people = people;
    }
    
      get WorkshopId() {
        return this.workshopId;
      }
    
      get Subtitle() {
        return this.subtitle;
      }
    
      get Name() {
        return this.name;
      }
    
      get Topic() {
        return this.topic;
      }
    
      get Details() {
        return this.details;
      }
    
      get Venue() {
        return this.venue;
      }
    
      get Date() {
        return this.date;
      }
    
      get Time() {
        return this.time;
      }

      get People(){
        return this.people;
      }
    
      set WorkshopId(workshopId) {
        this.workshopId = workshopId;
      }
    
      set Subtitle(subtitle) {
        this.subtitle = subtitle;
      }
    
      set Name(name) {
        this.name = name;
      }
    
      set Topic(topic) {
        this.topic = topic;
      }
    
      set Details(details) {
        this.details = details;
      }
    
      set Venue(venue) {
        this.venue = venue;
      }
    
      set Date(date) {
        this.date = date;
      }
    
      set Time(time) {
        this.time = time;
      }
      set People(people){
        this.people = people;
      }
      
    }
    
    
    module.exports.connection = connection;
    