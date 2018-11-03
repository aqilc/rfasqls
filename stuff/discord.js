// So we can use the classes to check crap
const discord = require("discord.js");
const Events = require("./events.js");
const map = discord.Collection;

class Discord extends Events {
	constructor(client, {
		cooldowns,
		name,
		prefix,
		cats,
		admins,
		args,
		tags,

		messages,
		gcdMessage,
		cdMessage,
		readyMessage,

		evalopt,
		evalprefix,
		evalfunc,
	} = {}, setup) {
		super();

		if(!client)
			return new Error("Need the 'client' object for this module to function properly")
		this.name = name;
		this.client = client;
		this.prefix = prefix;
		this.eval = {
			prefix: evalprefix || (evalopt && evalopt.prefix),
			func: (typeof evalfunc === "function" && evalfunc) || (evalopt && typeof evalopt.func === "function") && evalopt.func,
		}
		this.cooldowns = {
			user: (cooldowns && cooldowns.user) || true,
			global: (cooldowns && cooldowns.global) || true,
		};
		this.messages = {
			cd: cdMessage || (messages && messages.cd) || `Please wait \`%time MS\` until you can use the \`%command\` command`,
			gcd: gcdMessage || (messages && messages.gcd) || `***SLOW DOWNNNN!*** You guys are using this command too fast! Wait \`%time MS\` before you can use \`%command\` command again`,
			ready: readyMessage || (messages && messages.ready) || `Client %username (ID: %id) online at %date\nCurrent Options set to: %options`,
		};
		this.categories = cats instanceof Array && cats || [];
		this.admins = admins instanceof Array && admins || [];
		if(tags && tags.file)
			this.tags = tags;

		if(!this.name)
			throw new Error("You need to specify your discord bot's name in the constructor options.")
		if(!this.prefix)
			throw new Error("You need to specify a prefix in the constructor options.")
		if(this.admins === [] && (this.evalprefix || this.evalfunc))
			console.warn("It is advisable to specify admins to use the eval abilities of this bot.")
		if(this.evalprefix && !this.evalfunc)
			console.warn("You should probably include an `evalfunc` function to use eval")
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
			gcd: args.gcd, // Global Cooldowns
			d: args.d || "d", // Description
			u: args.u || "u" // Usage
		};

		if(setup)
			this.setup();

		// Events
		this._events = [];

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
		let command = Object.keys(this._commands).find(n => n == name || (this._commands[n][this._args.a] && this._commands[n][this._args.a].includes(name))),
				cmd = this._commands[command];
		return (cmd.name = command);
	}
	setup() {
		const cooldowns = new map();
		const gcooldowns = new map();

		if(!this.evalprefix && this.evalfunc)
			this.commands = {
				eval: {
					[this._args.f]: this.evalfunc,
				}
			};

		this.client.on("ready", () => {
			console.log(`${this.client.user.tag} (ID:${this.client.user.id}) is online on ${new Date().toUTCString()}`);
			this.emit("ready");
		})
		this.client.on("message", msg => {
			this.emit("message", msg);
			if(this.evalprefix && this.evalfunc && msg.content.startsWith(this.evalprefix) && this.admins.includes(msg.author.id))
				this.evalfunc(msg, msg.content.slice(this.evalprefix.length).trim());
			if(msg.channel.type !== "text")
				return this.emit("dm", msg);

			const prefix = msg.content.startsWith(this.prefix) && this.prefix || msg.content.match(new RegExp(`^<@!?${this.client.user.id}> `)) && msg.content.match(new RegExp(`^<@!?${this.client.user.id}> `))[0];
			if(msg.author.bot || !prefix)
				return this.emit("no-command", msg);

			const args = msg.content.slice(prefix.length).trim().split(/ +/g);
			const cmd = args.shift().toLowerCase();
			const content = msg.content.slice(prefix.length + cmd).trim();
			const command = this.command(cmd);

			if(!command)
				return this.emit("no-command", msg);

			// Cooldowns
			if (this.cooldowns) {
				let cd = command[this._args.cd] || 0;
				if(cd && !cooldowns.has(command.name))
					cooldowns.set(command.name, new map())
				let timestamps = cooldowns.get(command.name), now = Date.now();
				if(!timestamps.has(msg.author.id) && cd)
					timestamps.set(msg.author.id, now), setTimeout(() => timestamps.delete(msg.author.id), cd);
				else if(cd) {
					let endtime = timestamps.get(msg.author.id) + cd;
					if(now < endtime)
						return msg.reply(this.messages.cd.replace(/%command/g, command.name).replace(/%time/g, endtime - Date.now()).replace(/%timesec/g, ((endtime - Date.now()) / 1000).toFixed(1)));
					timestamps.set(msg.author.id, now), setTimeout(() => timestamps.delete(msg.author.id), cd);
				}
			}

			// Global Cooldowns
			if (this.gcooldowns) {
				let gcd = command[this._args.gcd] || 0;
				if(gcd)
					if((gcooldowns.get(command.name) || 0) + gcd > Date.now())
						return msg.reply(this.messages.gcd.replace(/%command/g, command.name).replace(/%time/g, gcooldowns.get(command.name) + gcd - Date.now()).replace(/%timesec/g, (gcooldowns.get(command.name) + gcd - Date.now()).toFixed(1)));
					else cooldowns.set(command.name, Date.now())
			}

			this.emit("command", msg, command);
			(command.count ++, command)[this._args.f](msg, content);
		})
		this.client.on("guildMemberAdd", member => this.emit("mem-join", member))
		this.client.on("guildMemberRemove", member => this.emit("mem-leave", member))

		return this;
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
	static hasRoles(member, role_name = ["Moderator"]) {
    if(typeof role_name === "string")
      role_name = [role_name];
    for(let i of role_name)
      if(!member.roles.find(r => r.name === i))
        return false;
    return true;
  }
	static async getMessage(guild, id) {
		for(let i of guild.channels.filter(c => c.type === "text").array()) {
			let msg;
			if((msg = i.messages.get(id)) || (msg = await i.fetchMessage(id)))
				return msg;
		}
	}
}
module.exports = Discord;
