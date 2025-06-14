const deleteBrandUrl = '/api/delete_brand'
const deleteModeUrl = '/api/delete_model'
const deleteModelVersionUrl = '/api/delete_model_version'

function onLoad() {
    setDeleteBrandButtons()
    setDeleteModelButtons()
    setDeleteModelVersionButtons()
    setDeleteUserButtons()
}

function setDeleteBrandButtons() {
    const deleteBrandButtons = document.querySelectorAll('.delete_brand_button')
    deleteBrandButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const response = await fetch(deleteBrandUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: event.target.dataset.brandId})
            })
            if (!response.ok) {
                console.error("Failed to delete brand")
                return
            }
            window.location.reload()
        })
    })
}

function setDeleteModelButtons() {
    const deleteModelButtons = document.querySelectorAll('.delete_model_button')
    deleteModelButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const response = await fetch(deleteModeUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: event.target.dataset.modelId})
            })
            if (!response.ok) {
                console.error("Failed to delete model")
                return
            }
            window.location.reload()
        })
    })
}

function setDeleteModelVersionButtons() {
    const deleteModelVersionButtons = document.querySelectorAll('.delete_model_version_button')
    deleteModelVersionButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            console.log(event.target.dataset)
            const response = await fetch(deleteModelVersionUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: event.target.dataset.modelVersionId})
            })
            if (!response.ok) {
                console.error("Failed to delete model version")
                return
            }
            window.location.reload()
        })
    })
}

function setDeleteUserButtons() {
    const deleteUserButtons = document.querySelectorAll('.delete_user_button')
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const response = await fetch('/api/delete_user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: event.target.dataset.userId})
            })
            if (!response.ok) {
                console.error("Failed to delete user")
                return
            }
            window.location.reload()
        })
    })
}
