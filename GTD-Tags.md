<%* 
	const app = this.app
	app.vault.adapter.fs.writeFileSync(app.vault.adapter.basePath + "/1. Projects/__ GTD/__Context.md", "")
	const files = app.vault.getMarkdownFiles()
	const allTags = {}
	const file = files[0]
	files.forEach((file) => {
		const tags =  app.metadataCache.getFileCache(file).tags
		if (file.path =="1. Projects/__ GTD/__Context.md") {
			app.workspace.activeLeaf.openFile(file)
		}
		if (tags) { 
			tags.forEach((tag) => {
				if (allTags[tag.tag] == undefined) {
					allTags[tag.tag] = 0
				} else {
					allTags[tag.tag]++
				}
			})
		}
	})
	const tags = []
	Object.entries(allTags).forEach((entry) => {
		tags.push({
			name: entry[0],
			value: entry[1]
		})
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
	//tp.file.cursor_append(content)
	app.vault.adapter.fs.writeFileSync(app.vault.adapter.basePath + "/1. Projects/__ GTD/__Context.md", content)
	const viewState = app.workspace.activeLeaf.getViewState()
	viewState.state.mode = "preview"
	app.workspace.activeLeaf.setViewState(viewState)
%>