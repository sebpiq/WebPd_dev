export const createButton = (label: string) => {
    const button = document.createElement('button')
    button.innerHTML = label
    document.body.appendChild(button)
    return button
}