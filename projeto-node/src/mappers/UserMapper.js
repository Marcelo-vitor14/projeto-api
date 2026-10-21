const UserDTO = require("../dtos/UserDTO");

class UserMapper {
  static toDTO(user) {
    if (!user) return null;
    return new UserDTO(user.id, user.name, user.email);
  }

  static toEntity(userDTOData) {
    return {
      name: userDTOData.name,
      email: userDTOData.email,
      password: userDTOData.password,
    };
  }
}

module.exports = UserMapper;
