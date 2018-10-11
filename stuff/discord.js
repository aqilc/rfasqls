// So we can use the classes to check crap
const discord = require("discord.js");

class Discord {
	constructor(client, { name, cooldown, cats, admins, prefix, evalprefix, args } = {}) {

		if(!client)
			return new Error("Need the 'client' object for this module to function properly")
		this.name = name;
		this.client = client;
		this.cooldown = cooldown;
		this.prefix = prefix;
		this.evalprefix = evalprefix;
		this.categories = Object.assign((cats instanceof Object && cats) || {}, {
			utility: "utility",
			fun: "fun",
			botAdmin: "botAdmin"
		});
		this.admins = (admins instanceof Array && admins) || [];

		if(!this.name)
			throw new Error("You need to specify your discord bot's name in the constructor options.")
		if(!this.prefix)
			throw new Error("You need to specify a prefix in the constructor options.")
		if(this.admins === [] && this.evalprefix)
			console.warn("It is advisable to specify admins to use the eval abilities of this bot.")
		if (!(args instanceof Object) || !Object.keys(args).every(v => typeof v === "string"))
			throw new Error("Every value in the 'args' object needs to be a string")

		// Command crap for later
		this._commands = {};
		this._cooldown =  {};
		this._args = {
			a: args.a || "a", // Aliases
			f: args.f || "f", // Command Function
			cat: args.cat || "cat", // Category
			h: args.h || "h", // Hidden or not
			p: args.p || "p", // Permissions
			cd: args.cd || "cd", // Cooldown
			d: args.d || "d", // Description
			u: args.u || "u" // Usage
		};


		// Events
		this._events = [];

		return this;
	}
	emit(event, ...args) {
    let e = this._events.filter(e => e.name === event);

    if(e !== []) {
      if(e.length === 1)
        e[0].fn(...args), e[0].called ++, e[0].last_call = Date.now();
      else
        for (var i = 0; i < e.length; i ++)
          e[i].fn(...args), e[i].called ++, e[i].last_call = Date.now();
    }

    // Returns the object
    return this;
  }
	on(event, fn) {
    if(typeof fn !== "function")
      return new Error("You need to specify a function when specifying an event");
    this._events.push({
      name: event,
      fn: fn,
      called: 0,
      last_call: new Date().valueOf(),
    });
    return this;
  }
	set commands(cmds) {
		if(!(cmds instanceof Object))
			return;

		let args = {
			[this._args.a]: [],
			[this._args.f]: () => {},
			[this._args.cat]: "",
			[this._args.h]: false,
			[this._args.p]: "",
			[this._args.cd]: 0,
			[this._args.d]: "",
			[this._args.u]: "",
			count: 0,
		}
		for(let i in cmds)
			for(let j in args)
				cmds[i][j] = cmds[i][j] || args[j];

		this._commands = Object.assign(this._commands, cmds)
	}
	get commands() {
		return this._commands;
	}
	command(name) {
		return this._commands[Object.keys(this._commands).find(n => n == name || (this._commands[n][this._args.a] && this._commands[n][this._args.a].includes(name)))];
	}
	setup() {
		this.client.on("ready", () => {
			console.log(`${this.client.user.tag} (ID:${this.client.user.id}) is online on ${new Date().toUTCString()}`);
			this.emit("ready");
		})
		this.client.on("message", msg => {
			this.emit("message", msg);
			if(this.evalprefix && msg.content.startsWith(this.evalprefix) && this.admins.includes(msg.author.id)) {
				let code = msg.content.slice(this.evalprefix.length).trim(), evalled;
				try {
					evalled = eval(code);
				} catch(err) {
					evalled = err;
				}
				return msg.channel.send(new discord.RichEmbed()
					.setAuthor("Run")
					.setDescription(`**Input:** \`\`\`js\n${code}\`\`\`\n**Output:** \`\`\`js\n${evalled}\`\`\``))
			}
			if(msg.channel.type !== "text")
				this.emit("dm", msg);

			const prefix = msg.content.startsWith(this.prefix) && this.prefix || msg.content.match(new RegExp(`^<@!?${this.client.user.id}> `)) && msg.content.match(new RegExp(`^<@!?${this.client.user.id}> `))[0];
			if(msg.author.bot || !prefix)
				return this.emit("no-command", msg);

			const args = msg.content.slice(prefix.length).trim().split(/ +/g);
			const content = msg.content.slice(prefix.length + args[0]);
			const command = this.command(args.shift().toLowerCase());

			if(!command)
				return this.emit("no-command", msg);
			this.emit("command", msg, command)
			command[this._args.f](msg, content)
		})
		this.client.on("guildMemberJoin", member => this.emit("mem-join", member))
		this.client.on("guildMemberJoin", member => this.emit("mem-leave", member))
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
    for(let i of role_name)
      if(!member.roles.find(r => r.name === i))
        return false;
    return true;
  }
}
module.exports = Discord;
