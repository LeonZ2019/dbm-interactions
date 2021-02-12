module.exports = {
  name: 'Edit Slash Command',
  section: 'Interactions',

  subtitle (data) {
    return `Edit`
  },

  fields: ['sourceCmd', 'cmdVar', 'cmdNameSel', 'cmdName', 'cmdDescSel', 'cmdDesc', 'cmdOptSel', 'cmdOpt', 'cmdOptVar'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Source Slash Command:<br>
      <select id="sourceCmd" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="cmdVar" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Slash Command Name:<br>
      <select id="cmdNameSel" class="round" onchange="glob.onChangeType(this)">
        <option value="0" selected>Keep Name</option>
        <option value="1">Edit Name</option>
      </select>
    </div>
    <div id="cmdNameHolder" style="display: none; float: right; width: 60%;">
      Name (3-32):<br>
      <input id="cmdName" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Slash Command Description:<br>
      <select id="cmdDescSel" class="round" onchange="glob.onChangeType(this)">
        <option value="0" selected>Keep Description</option>
        <option value="1">Edit Description</option>
      </select>
    </div>
    <div id="cmdDescHolder" style="display: none; float: right; width: 60%;">
      Description (1-100):<br>
      <input id="cmdDesc" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Slash Command Options:<br>
      <select id="cmdOptSel" class="round" onchange="glob.onChangeType(this)">
        <option value="0" selected>Keep Options</option>
        <option value="1">Edit Options</option>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;" id="cmdOptHolder">
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
  </div>`
  },

  init () {
    const { glob, document } = this
    const elementIds = { cmdNameSel: 'cmdNameHolder', cmdDescSel: 'cmdDescHolder', cmdOptSel: 'cmdOptHolder' }
    glob.onChangeType = function (event) {
      const element = document.getElementById(elementIds[event.id])
      switch (parseInt(event.value)) {
        case 0: element.style.display = 'none'; break
        case 1: element.style.display = null; break
      }
    }
    for (const idSel in elementIds) glob.onChangeType(document.getElementById(idSel))
    glob.refreshVariableList(document.getElementById('sourceCmd'))
    glob.refreshVariableList(document.getElementById('storage'))
  },

  async action (cache) {
    const sourceCmd = parseInt(data.sourceCmd)
    const cmdVar = this.evalMessage(data.cmdVar, cache)
    const slashCmd = this.getVariable(sourceCmd, cmdVar, cache)
    let newSlashCmd = {}
    if (parseInt(data.cmdNameSel) === 1) newSlashCmd.name = this.evalMessage(data.cmdName, cache)
    if (parseInt(data.cmdDescSel) === 1) newSlashCmd.description = this.evalMessage(data.cmdDesc, cache)
    if (parseInt(data.cmdOptSel) === 1) {
      const cmdOpt = parseInt(data.cmdOpt)
      const cmdOptVar = this.evalMessage(data.cmdOptVar, cache)
      const options = this.getVariable(cmdOpt, cmdOptVar, cache)
      newSlashCmd.options = options
    }
    if (Object.keys(newSlashCmd).length > 0) {
      Object.assign(slashCmd, newSlashCmd)
      await this.client.api.interactions(slashCmd.id, slashCmd.token).callback.post({ data: slashCmd, query: { wait: true } })
      // await slashCmd._patch() // wait for .edit() in github https://github.com/discordjs/discord.js/blob/1c63c500a89472af5ed41dac5eb08ec22f08debd/src/structures/ApplicationCommand.js
    }
    this.callNextAction(cache) // :)
  },

  mod () {}

}
