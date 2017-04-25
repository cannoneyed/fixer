import FixerController from '../controller'

export default function init() {
    // Initialize DOM Element to attach controller to
    const body = document.getElementsByTagName('body')[0]
    const container = document.createElement('div')
    container.setAttribute('id', 'fixerView')
    body.appendChild(container)

    // Add the singleton class for controlling the test generation data
    window.fixerController = FixerController
}
