module.exports = {
  name: 'Create Slash Command',
  section: 'Interactions',

  subtitle (data) {
    return `${data.serverName}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage3)
    if (type !== varType) return
    return ([data.varName, 'Slash Command']) // ApplicationCommand
  },

  fields: ['isGlobal', 'server', 'varName', 'name'],
  html (isEvent, data) {
    return `
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Is Global:
      <select id="isGlobal" class="round" onchange="glob.isGlobal(this)">
        <option value=true>True</options>
        <option value=false>False</options>
      </select>
    </div>
  </div><br><br><br>
  <div id="isGlobalPlaceHolder" stlye="display: none; padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Source Server:<br>
      <select id="sourceServer" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
        ${data.servers[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="serverVar" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width:90%;">
      Slash Command Name:<br>
      <input id="cmdName" pattern="^[\w-]{1,32}$" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width:90%;">
      Slash Command Description:<br>
      <input id="cmdDesc" maxlength="100" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;" >
    <div style="float: left; width: 35%;">
      Source Options:<br>
      <select id="cmdOpt" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="cmdOptVar" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storeCmd" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="cmdVar" class="round" type="text"><br>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
    glob.isGlobal = (event) => {
      switch(parseInt(event.value)) {
        case "true": // ?
          document.getElementById('isGlobalPlaceHolder').style.display = 'none'
          break
        case "false": // ? or case false?
          document.getElementById('isGlobalPlaceHolder').style.display = null
          break
      }
    }
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    let guild
    if (!data.isGlobal) guild = this.getServer(parseInt(data.server), this.evalMessage(data.varName, cache), cache)
    const cmd = {}
    cmd.name = this.evalMessage(data.name, cache)
    cmd.description = this.evalMessage(data.description, cache)
    const varName2 = this.evalMessage(data.varName2, cache)
    const storage2 = parseInt(data.storage2)
    cmd.options = this.getVariable(storage2, varName2, cache)
    try {
      const slashCommand = await this.interactionClient.createCommand(cmd, guild)
      if (storage3) {
        this.storeValue(slashCommand, storage3, varName3, cache)
      }
      this.callNextAction(cache)
    } catch (err) {
      if (err.name === 'no permissions?') {
        console.log('Missing authorization scope - applications.commands')
        console.log(`https://discord.com/oauth2/authorize?client_id=${this.getDBM().Bot.bot.user.id}&scope=applications.commands`)
        this.callNextAction(cache)
      } else {
        console.error(err)
      }
    }
  },

  mod: function (DBM) {
    DBM.Actions.Interactions = {}
    DBM.Actions.Interactions.onError = function (err) {
      console.log(err)
    }
    DBM.Actions.Interactions.autoHelper = function (cache) {
      console.log(cache.index)
    }
  }
}
