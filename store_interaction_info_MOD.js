module.exports = {
  name: 'Store Interaction Info',
  section: 'Interactions',

  subtitle (data) {
    const info = ['Interaction ID', 'Interaction Type', "Interaction's Server", "Interaction's Channel", "Interaction's Author", "Interaction's Command", "Interaction's Command ID", "Interaction's Command Name", "Interaction's Parameters", "Interaction's Created At"]
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataTypes = ['Interaction ID', 'Interaction Type', "Interaction's Server", "Interaction's Channel", "Interaction's Author", "Interaction's Command", "Interaction's Command ID", "Interaction's Command Name", "Interaction's Parameters", "Interaction's Created At"]
    return ([data.varName2, dataTypes[parseInt(data.info)]])
  },

  fields: ['category', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
    <div>
    <div style="float: left; width: 35%;">
      Source Interaction:<br>
      <select id="sourceInteraction" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div>
    <div style="padding-top: 8px; width: 70%;">
      Source Info:<br>
      <select id="info" class="round">
        <option value="0">Interaction ID</option>
        <option value="1">Interaction Type</option>
        <option value="2">Interaction's Server</option>
        <option value="3">Interaction's Channel</option>
        <option value="4">Interaction's Author</option>
        <option value="5">Interaction's Command</option>
        <option value="6">Interaction's Command ID</option>
        <option value="7">Interaction's Command Name</option>
        <option value="8">Interaction's Parameters</option>
        <option value="9">Interaction's Created At</option>
      </select>
    </div>
  </div><br>
  <div>
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text">
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('category'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const sourceInteraction = parseInt(data.sourceInteraction)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const interaction = this.getVariable(sourceInteraction, varName, cache)
    let result
    switch (info) {
      case 0:
        result = interaction.id
        break
      case 1:
        result = interaction.type
        break
      case 2:
        result = interaction.guild
        break
      case 3:
        result = interaction.channel
        break
      case 4:
        result = interaction.member
        break
      case 5:
        const slashCommands = await this.client.interactionClient.fetchCommands(guild)
        result = slashCommands.get(interaction.commandID)
        break
      case 6:
        result = interaction.commandID
        break
      case 7:
        result = interaction.commandName 
        break
      case 8:
        result = interaction.options 
        break
      case 9:
        result = interaction.createdAt
        break
    }
    if (result) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}

}
