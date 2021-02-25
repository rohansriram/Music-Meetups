class user {
    constructor(userId, firstname, lastname, email, password, city, state, zipcode, country) {
      this.userId = userId;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.password = password;
      this.city = city;
      this.state = state;
      this.zipcode = zipcode;
      this.country = country;
    }
  }
  
  module.exports.user = user;
  