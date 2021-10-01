<%* 
	const app = this.app
	app.vault.adapter.fs.writeFileSync(app.vault.adapter.basePath + "/1. Projects/__ GTD/__Context.md", "")
	const files = app.vault.getMarkdownFiles()
	const allTags = {}
	const file = files[0]
	let fileToSwitchTo
	files.forEach((file) => {
		const tags =  app.metadataCache.getFileCache(file).tags
		if (file.path =="1. Projects/__ GTD/__Context.md") {
			console.log("opening File")
			fileToSwitchTo = file
		}
		if (tags) { 
			tags.forEach((tag) => {
				if (allTags[tag.tag] == undefined) {
					allTags[tag.tag] = 1
				} else {
					allTags[tag.tag]++
				}
			})
		}
	})
	const tags = []
	Object.entries(allTags).forEach((entry) => {
		if (entry[1] > 0) {
			tags.push({
				name: entry[0],
				value: entry[1]
			})
		}
	})
	tags.sort((a, b) => {
		return b.value - a.value
	})
	const context = await tp.system.suggester((item) => `${item.value} | ${item.name}`, tags)
	const content = `### **${context.name}**
\`\`\`tasks
not done
no due date
description includes ${context.name}
\`\`\`
`;
	app.vault.adapter.fs.writeFile(app.vault.adapter.basePath + "/1. Projects/__ GTD/__Context.md", content, async (err) => {
		console.log(err)
		await app.workspace.activeLeaf.openFile(fileToSwitchTo) 
		const viewState = app.workspace.activeLeaf.getViewState()
		viewState.state.mode = "preview"
		app.workspace.activeLeaf.setViewState(viewState)
	})
%>