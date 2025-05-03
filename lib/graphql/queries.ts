import { gql } from "@apollo/client"

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password })
  }
`

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    getDepartments {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`

export const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment($parentId: ID!, $name: String!) {
    createSubDepartment(parentId: $parentId, name: $name) {
      id
      name
      parent {
        id
        name
      }
    }
  }
`

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
    }
  }
`

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`
