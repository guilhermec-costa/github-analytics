export default class DIContainer {
    dependencies: { [name: string]: unknown }
    static instance: DIContainer

    private constructor() {
        this.dependencies = {}
    }

    provide<T>(name: string, dependency: T) {
        this.dependencies[name] = dependency
    }

    inject<T>(name: string): T | undefined {
        return this.dependencies[name] as T
    }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer()
        }
        return DIContainer.instance
    }
}

export function inject<T>(name: string) {
    return function (target: any, propertyKey: string) {
        console.log(target)
        console.log(propertyKey)
        target[propertyKey] = new Proxy({}, {
            get(_,propertyKey) {
                const dependency = DIContainer.getInstance().inject<T>(name)
                if (!dependency) throw new Error(`Dependency '${name}' not found`)
                return dependency[propertyKey as keyof T]
            }
        })
    }
}