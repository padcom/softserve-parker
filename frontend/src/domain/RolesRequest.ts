import { query } from '@/graphql'

export class RolesRequest {
  static async fetchByUserId (
    userId: number,
    fields: string[] = ['id', 'name']
  ) {
    const { rolesRequests } = await query(
      `query
      RolesRequests($from: $userId: Int!) {
        rolesRequests(from: $from, userId: $userId) {
          ${fields.join('\n')}
        }
      }`,
      {
        userId
      }
    )
    return rolesRequests
  }

  static async cancel (requestId: number): Promise<number | Error> {
    return query(
      `mutation
      cancelRoleRequest($id: Int!) {
        cancelRoleRequest(id: $id)
      }`,
      {
        id: requestId
      }
    )
  }

  static async createRequest (
    userId: number,
    fields: string[] = ['id', 'name']
  ) {
    const { roleRequests } = await query(
      `mutation
      CreateRolesRequest($name: $userId: Int!) {
        createRolesRequest(name: $name, userId: $userId) {
          ${fields.join('\n')}
        }
      }`,
      {
        userId
      }
    )
    return roleRequests
  }
}
