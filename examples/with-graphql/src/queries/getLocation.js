import gql from 'graphql-tag'

export default gql`
{
  getLocation(ip: "189.59.228.170") {
    location {
      latitude
      longitude
    }
  }
}
`
