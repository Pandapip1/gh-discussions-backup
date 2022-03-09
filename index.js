const core = require('@actions/core');
const github = require('@actions/github');
const { GraphQLClient, gql } = require('graphql-request');



(async () => {
    // Inputs
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    const token = core.getInput('token');

    // Processing
    const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
        headers: {
            authorization: `bearer ${token}`
        }
    });
    const resultsCount = await graphQLClient.request(gql`{
        repository(owner: "${payload.repository.owner.login}", name: "${payload.repository.name}") {
            discussions(first: 1) {
                totalCount
            }
        }
    }`);
    console.log(resultsCount);

    /*const results = await graphQLClient.request(gql`{
        repository(owner: "github", name: "some-repo") {
            discussions(first: 10) {
                totalCount
      
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
      
                edges {
                    cursor
                    node {
                        id
                    }
                }
            }
        }
    }`);*/
    
    // Outputs
    core.setOutput("backup", []);
})().catch(err => core.setFailed(err.message));