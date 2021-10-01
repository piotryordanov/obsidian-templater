<%* const basePath = app.vault.adapter.basePath;
 
 const projectName = await tp.system.prompt("Enter a project name")
 console.log(projectName)
 if (projectName == null) {
 	return;
 }
 const projectPath = "1. Projects/" + projectName;
 try {
	 const folder =  await app.vault.createFolder(projectPath);
	 const folders = await tp.user.helpers().getVaultFolders(app)
	 let curr = folders.filter((item) => {
		 if (item.path.includes("1. Projects")) {
			if(item.path.includes(projectName))
				return item
	 }
	})
	 await tp.file.create_new("", projectName, false, curr[0]).then((err) => {
		 console.log("file created")
		 console.log(err)
	 })
 } catch (err) {
	 console.log(err)
 }
%>

