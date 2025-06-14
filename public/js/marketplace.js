function setMarketplaceFormActions() {
    const brandSelector = document.getElementById('brand_selector')
    const modelSelector = document.getElementById('model_selector')
    const versionSelector = document.getElementById('model_version_id')

    if (!brandSelector || !modelSelector || !versionSelector) {
        return
    }

    brandSelector.addEventListener('change', async (event) => {
        const brandId = event.target.value
        if (!brandId) {
            return
        }

        const response = await fetch(`/api/models/${brandId}`)
        if (!response.ok) {
            console.error("Failed to fetch models for brand")
            return
        }

        const models = await response.json()
        modelSelector.innerHTML = '<option value="" disabled selected>Wybierz model</option>'
        models.forEach(model => {
            const option = document.createElement('option')
            option.value = model.id
            option.textContent = model.name
            modelSelector.appendChild(option)
        })
    })

    modelSelector.addEventListener('change', async (event) => {
        const modelId = event.target.value
        if (!modelId) {
            return
        }

        const response = await fetch(`/api/model_versions/${modelId}`)
        if (!response.ok) {
            console.error("Failed to fetch model versions")
            return
        }

        const versions = await response.json()
        versionSelector.innerHTML = '<option value="" disabled selected>Wybierz wersję</option>'
        versions.forEach(version => {
            const option = document.createElement('option')
            option.value = version.modelVersionId
            option.textContent = version.productionStart + ' - ' + (version.productionEnd || 'obecnie') + ', ' + version.bodyType + ', ' + version.engineCapacity + 'L, ' + version.power + 'KM, ' + version.fuelType
            versionSelector.appendChild(option)
        })
    })
}