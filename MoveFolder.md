<%* const app = this.app
	const folders = await tp.user.helpers().getVaultFolders(app)
	
	let currentFolder;
	folders.forEach((folder) => {
		if (folder.path == tp.file.folder(true)) {
			currentFolder = folder
		}
	})
	
	const newFolder = await tp.system.suggester((item) => item.path, folders)
	const currentPath = tp.file.folder()
	const newFolderPath = newFolder.path + "/" + currentPath
	app.vault.rename(currentFolder, newFolderPath) %>