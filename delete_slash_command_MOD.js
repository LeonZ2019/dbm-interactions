module.exports = {
	name: 'Delete Slash Command',
	section: 'Interactions',

	subtitle (data) {
    const storeTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
		return `Delete ${storeTypes[parseInt(data.sourceSlashCmd)]} (${data.varName}) Slash Command`
	},

  fields: ['sourceSlashCmd', 'varName'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Source Slash Command:<br>
      <select id="sourceSlashCmd" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      If Delete Fails:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump To Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="padding-left: 5%; display: none; float: left; width: 65%;">
      <span id="iffalseName">Action Number</span>:<br>
      <input id="iffalseVal" class="round" type="text">
    </div>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
    glob.onChangeFalse = function (event) {
      const name = document.getElementById('iffalseName').innerHTML
      const container = document.getElementById('iffalseContainer').style.display
      switch (parseInt(value)) {
        case 0:
        case 1:
          container = 'none'
          break
        case 2:
          name = 'Action Number'
          container = null
          break
        case 3:
          name = 'Number of Actions to Skip'
          container = null
          break
        case 4:
          name = 'Anchor ID'
          container = null
          break
      }
    }
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const sourceSlashCmd = parseInt(data.sourceSlashCmd)
    const varName = this.evalMessage(data.varName, cache)
    const slashCmd = this.getVariable(sourceSlashCmd, varName, cache)
    try {
      await slashCmd.delete()
      this.callNextAction(cache)
    } catch (err) {
      console.error(err)
      this.executeResults(false, data, cache)
    }
  },

  mod () {}
}
