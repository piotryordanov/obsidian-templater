const doesPathExist = async (app, itemPath) => {
    const basePath = app.vault.adapter.basePath;
    const exists = await app.vault.adapter.fs.existsSync(basePath + "/" + itemPath)
    return exists
}

const fs = require('fs')

const emptyFile = (tp) => {
	fs.writeFileSync(tp.file.path(), "")
}

const getVaultFolders = async (app) => {
	const root = app.vault.getRoot()
	const folders = []
	
	const scanFolder = (folder) => {
		 if (!folder.extension) {
			 folders.push(folder)
		 }
		 if (folder.children) {
		 	folder.children.forEach((child) => {
				scanFolder(child)
			})
		 }
	}
	scanFolder(root)

    const uniqueFolder = folders.filter((value, index, self) => {
        return self.indexOf(value) === index
    })

    return folders
};

module.exports = () => ({
    getVaultFolders: getVaultFolders,
    doesPathExist: doesPathExist,
	emptyFile: emptyFile
})