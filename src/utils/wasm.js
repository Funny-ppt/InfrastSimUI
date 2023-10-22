import { dotnet } from '/wasm/dotnet.js?url'

export class WasmSimulator {
  #promise_ready
  #id
  #service

  constructor() {
    this.#promise_ready = this.#init()
  }

  async #init() {
    const { setModuleImports, getAssemblyExports, getConfig } = await dotnet.create()

    setModuleImports('main.js', {
      window: {
        location: {
          href: () => window.location.href
        }
      }
    })

    const config = getConfig()
    const exports = await getAssemblyExports(config.mainAssemblyName)
    this.#service = exports.InfrastSim.Wasm.SimulatorService
    this.#id = this.#service.Create()

    return this
  }

  ready() {
    return this.#promise_ready
  }

  get_data() {
    return JSON.parse(this.#service.GetData(this.#id))
  }
}
