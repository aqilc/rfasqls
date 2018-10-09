class Discord {
	constructor(client) {
		this.client = client
	}
	static get rcol() {
		return Math.round(Math.random() * 16777215);
	}
	static getId(guild, text, per) {
    if(!guild)
      return new Error("Please specify the guild");
    if(!text || text === "")
      return false;

    let id = text.replace(/[^0-9]/g, ""), person;
    if(id.length === 18)
      return id;
    else if(text.includes("#") && text.split("#")[1].trim().length === 4)
      person = guild.members.array().filter(m => m.user.tag.toLowerCase() === text.toLowerCase())[0];
    else {
      person = guild.members.array().filter(m => m.user.username.toLowerCase() === text.toLowerCase() || (m.nickname ? m.nickname : "").toLowerCase() === text.toLowerCase())[0];
      if(!person)
        person = guild.members.array().filter(m => m.user.username.toLowerCase().startsWith(text.toLowerCase()) || (m.nickname ? m.nickname.toLowerCase().startsWith(text.toLowerCase()) : false))[0];
    }

    // If it asks for the entire user object
    if(per === "u")
      return person.user;
    if(per)
      return person;

    return person.id;
  }
	static has_roles(member, role_name = ["Moderator"]) {
    if(typeof role_name === "string")
      role_name = [role_name];
    for(let i of role_name) {
      if(!member.roles.map(r => r.name).includes(i))
        return false;
    }
    return true;
  }
}
module.exports = Discord;
