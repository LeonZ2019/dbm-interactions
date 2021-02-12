module.exports = {
  name: 'Acknowledge Interaction',
  section: 'Interactions',

  subtitle (data) {
		const message = ["Command Message", "Temp Variable", "Server Variable", "Global Variable"]
    return `${message[parseInt(data.message)]}`
  },

  fields: ['interact', 'varName'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Source Interaction:<br>
      <select id="interact" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
        ${data.messages[isEvent ? 1 : 0]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div>`
  },///asd

  init () {
    const { glob, document } = this
		glob.messageChange(document.getElementById("message"), "varNameContainer")
  },

  async action (cache) {
    const interact = parseInt(data.interact)
    const varName = this.evalMessage(data.varName, cache)
    const interaction = this.getVariable(interact, varName, cache)
    await interaction.acknowledge(true)
    this.callNextAction(cache)
  },

  mod () {}
}
