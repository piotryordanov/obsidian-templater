const fs = require('fs')

function my_function(tp, app) {
	console.log(tp.file.path())
	// fs.writeFileSync(tp.file.path(), content);
	fs.writeFile(tp.file.path(), "", err => {
		if (err) {
			console.error(err)
			return
		} else {
			setTimeout(() => {
				printFolderChildren(app.vault.getRoot())
			}, 100)

		}
	})

	const printFolderChildren = (folder) => {
		if (!folder.extension) {
			if (folder.path.includes("1. Projects")) {
				let splits = folder.path.split("/")
				console.log(splits)
				if (splits.length == 2)  {
					let path = folder.path.split('/')[1]
					if (path != "__GTD") {
						console.log(path)
						tp.file.cursor_append("\n#### **" + path + "**")
						const test = `
\`\`\`tasks
not done
path includes ${path}
sort by path
\`\`\`
				`
						tp.file.cursor_append(test)
					}
				}

			}
		}
		if (folder.children) {
			folder.children.forEach((child) => {
				printFolderChildren(child)
			})
		}
	}
	return ""
}
module.exports = my_function;