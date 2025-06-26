import { Octokit} from "https://esm.sh/octokit"

class Home{
    constructor(){
        this.descriptionHTML = document.querySelector (".js-home-description")
        this.profilHTML = document.querySelector (".js-home-profil-url")
        this.avatarHTML = document.querySelector (".js-home-avatar")
        this.projectsTitle = document.querySelectorAll (".js-home-project-title")
        this.projectsDescription = document.querySelectorAll (".js-home-project-description")
        this.projectsTagsContainer = document.querySelectorAll (".js-home-project-tags-container")
        this.APIdata = {}

        this.init()
    }
    init (){
        this.getUserInformation ()
        this.getReposInformations ()
    }
    getUserInformation(){
        fetch("https://api.github.com/users/Geraldine743")
        .then((response) => response.json())
        .then((data) => {
            this.updateHTMLUser (data)
        })
        .catch((error) => {
            console.log("ERREUR lors de l'appel api", error)
        })
    }

    async getReposInformations (){
        const octokit = new Octokit()
        const response = await octokit
            .request("GET /users/Geraldine743/repos")
            .catch((error) => {
                console.log("ERREUR lors de l'appel api", error)
            })
        const recentsProjects = response.data.slice (-3)
        
        for (let i=0; i<recentsProjects.length; i++){
            const languagesUrl = recentsProjects[i].languages_url
            const cleanedUrl = languagesUrl.replace ("https://api.github.com", "")
            const responseLanguages = await octokit
                .request (`GET ${cleanedUrl}`)
                .catch((error) => {
                console.log("ERREUR lors de l'appel api", error)
            })
            const projectLanguages = responseLanguages.data
            recentsProjects[i].languages = projectLanguages
        }
        
        this.updateHTMLProject(recentsProjects)
    }

    updateHTMLUser(APIdata){
        this.descriptionHTML.textContent = APIdata.bio
        this.profilHTML.setAttribute("href", APIdata.html_url)
        this.avatarHTML.setAttribute("src", APIdata.avatar_url)
    }

    updateHTMLProject (projects) {
        const maxIndex = projects.length -1
        let htmlProject = 0
        for (let i = maxIndex; i>maxIndex -3; i--){
            const project = projects [i]
            this.projectsTitle[htmlProject].textContent = project.name
            this.projectsDescription[htmlProject].textContent = project.description
            this.createHTMLLanguageTag (this.projectsTagsContainer[i], project.languages)
            htmlProject ++
            
        }
    }

    createHTMLLanguageTag (div, languages){
        const arrayLanguages = Object.keys (languages)
        for (let i=0; i<arrayLanguages.length; i++){
            const span = document.createElement('span')
            span.textContent = arrayLanguages[i]
            div.appendChild(span)
        }
    } 

}

export{ Home }