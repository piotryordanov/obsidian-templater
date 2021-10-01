<%*  const app = this.app
	setTimeout(async () => {
		app.vault.adapter.fs.writeFileSync(tp.file.path(), "")
	setTimeout(async () => {
		const folders = await tp.user.helpers().getVaultFolders(app)
		const GTDDefaults = {}
		const contexts = {}
		const generalProjects = {}
		const createContent = (file, replace) => {
			const project = replace? file.path.split("/")[2]: file.path.split("/")[1]
			const key = replace? project.replace(".md", ""): project
			const content = `### **[[${key}]]**
\`\`\`tasks
not done
path includes ${key.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}
no due date
hide backlink
\`\`\`
`;
			return {project: project, key: key, content: content};
		}
		folders.forEach((folder) =>{
			if (folder.path.includes("1. Projects")) {
				if (folder.path.includes("__ GTD")) {
					folder.children.forEach((file) => {
						const {project, key, content} = createContent(file, true)
						if (project.includes("__")) {
							GTDDefaults[key] = content
						} else {
							contexts[key] = content
						}
					})
				} else {
					if (folder.path.split("/").length > 1) {
						const {project, key, content} = createContent(folder, false)
						generalProjects[key] = content
					}
				}
			}
		})

		console.log(contexts)
		console.log(GTDDefaults)
		console.log(generalProjects)
		tp.file.cursor_append(`
### Due
\`\`\`tasks
not done
due before tomorrow
\`\`\`
----
`)
		Object.keys(generalProjects).forEach((key) => {
			tp.file.cursor_append(generalProjects[key])
		})
		Object.keys(contexts).forEach((key) => {
			tp.file.cursor_append(contexts[key])
		})
		tp.file.cursor_append(GTDDefaults["__Waiting For"])
		const viewState = app.workspace.activeLeaf.getViewState()
		viewState.state.mode = "preview"
		app.workspace.activeLeaf.setViewState(viewState)
	}, 200)
	}, 100)
%>
