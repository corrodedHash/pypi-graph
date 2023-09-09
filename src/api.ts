export async function getVersions(pkgname: string): Promise<string[]> {
  const response = await fetch(`https://pypi.org/simple/${pkgname}/`, {
    headers: { Accept: 'application/vnd.pypi.simple.v1+json' }
  }).then((v) => v.json())
  return response.versions
}

export interface Dependency {
  name: string
  version_requirement: string
}

export async function getDependencies(
  pkgname: string,
  version: string
): Promise<{ deps: Dependency[]; python: string }> {
  const response = await fetch(`https://pypi.org/pypi/${pkgname}/${version}/json`, {
    headers: { Accept: 'application/vnd.pypi.simple.v1+json' }
  }).then((v) => v.json())
  const req: string[] | null = response.info.requires_dist
  const deps = req
    ? req
        .map((v) => {
          const m = v.match(/(?<pkgname>[^\s\>\<\=\~\^\(]+)(?<rest>.*)/)
          if (m === null) {
            console.warn('Could not parse ', v)
            return undefined
          }
          if (m.groups === undefined) {
            console.warn('No groups', v, m)
            return undefined
          }

          return { name: m.groups['pkgname'], version_requirement: m.groups['rest'] }
        })
        .filter((v): v is Dependency => v !== undefined)
    : []
  return {
    deps,
    python: response.info.requires_python
  }
}
