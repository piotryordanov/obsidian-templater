<%* 
	const app = this.app
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array
	}

	const files = app.vault.getMarkdownFiles()
	let tasks = {}
	files.forEach((file) => {
		let hasTask = false
		const cache =  app.metadataCache.getFileCache(file)
		if (cache.listItems != undefined) {
			cache.listItems.forEach((item) => {
				if (item.task != undefined) {
					hasTask = true
				}
			})
		}
		if (hasTask) {
			const content = app.vault.adapter.fs.readFileSync(app.vault.adapter.basePath + "/" + file.path, 'utf8')
			content.split("\n").forEach((line) => {
				if(line.includes("- [ ]")) {
					let task = line.split("- [ ] ")[1]
					if (task != undefined) {
						var regexp = /(\s|^)\#\w\w+\b/gm
						const tags = task.match(regexp);
						if (tags) { 
							tags.forEach((tag) => {
								task = task.replaceAll(tag, '')
							})
							task = task.trim(" ")
							tags.forEach((tag) => {
								if (tasks[tag] == undefined) {
									tasks[tag] = [{ text: task, file: file}]
								} else {
									tasks[tag].push({
										text: task,
										file: file
									})
								}
							})
						}
					}
				}
			})
		}
	})
	const tags = []
	Object.entries(tasks).forEach((entry) => {
		if (entry[1].length > 0) {
			tags.push({
				name: entry[0],
				value: entry[1]
			})
		}
	})
	tags.sort((a, b) => {
		return b.value.length - a.value.length
	})
	const context = await tp.system.suggester((item) => `${item.value.length} | ${item.name}`, tags)
	const tasksToDisplay = shuffleArray(tasks[context.name])
	const task = await tp.system.suggester(
		(item) => `${item.text} (${item.file.path})`,
		tasksToDisplay, true, "Select a task")
	
	const taskActions = ["Complete", "Change Context"]
	const action = await tp.system.suggester((item) => item, taskActions)
	let newContext
	if (action == "Change Context") {
		 newContext = await tp.system.suggester((item) => `${item.value.length} | ${item.name}`, tags)
	}
	const content = app.vault.adapter.fs.readFileSync(app.vault.adapter.basePath + "/" + task.file.path, 'utf8')
	let newContent = ""
	let completedTask = ""
	
	content.split("\n").forEach((line) => {
		if (line.includes (task.text)) {
			if (action == "Complete") {
				line = line.replace("- [ ]", "- [x]")
				line +=  ` ✅ ${new Date().toISOString().split('T')[0]}`
				completedTask = line
			} else if (action == "Change Context") {
				line = line.replace(context.name, newContext.name)
				newContent += line + "\n"
			}
		} else {
			newContent += line + "\n"
		}
	})
	if (action == "Complete") {
		newContent += completedTask
	}
	app.vault.adapter.fs.writeFile(app.vault.adapter.basePath + "/" + task.file.path, newContent, async (err) => {
		console.log(err)
	})
	
%>