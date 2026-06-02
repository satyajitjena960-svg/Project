package model;

public class User {
    int Id;
    String Name;
    String Email;
    String Password;
    String Address;

    public User(int id, String name, String email, String password, String address) {
        Id = id;
        Name = name;
        Email = email;
        Password = password;
        Address = address;
    }

    @Override
    public String toString() {
        return "User{" +
                "Id=" + Id +
                ", Name='" + Name + '\'' +
                ", Email='" + Email + '\'' +
                ", Password='" + Password + '\'' +
                ", Address='" + Address + '\'' +
                '}';
    }
}
