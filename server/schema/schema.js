const { projects, clients } = require("../sampleData")
const Project = require("../models/project")
const Client = require("../models/client")
const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql")

const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve: (parent, args) => {
                return Client.findById(parent.clientID);
            }
        }
    })
})

const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve: (parent, args) => {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            argsL: { type: GraphQLID },
            resolve: (parent, args) => {
                return Project.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType
})