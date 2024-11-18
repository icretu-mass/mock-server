const users = require("../fixtures/users")

const apiMutation = {
	$metadata: {
		httpStatusCode: 200,
		requestId: "071a4076-0550-46f6-829f-9cbe83c057b0",
		attempts: 1,
		totalRetryDelay: 0
	},
	Entries: [
		{
			EventId: "c950f268-2f3d-e49d-636a-ffa149b61be9"
		}
	],
	FailedEntryCount: 0
}

module.exports = [
	{
		id: "get-users-paginated", // id of the route
		url: "/admin/api/identity-management-svc/control/external/get-users", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const body = req.body
						const { pageNumber, pageSize } = body

						const todoRes = {
							rows: users.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
							pageNumber,
							pageSize,
							total: users.length
						}

						res.status(200)
						res.send(todoRes)
					}
				}
			},
			{
				id: "empty", // id of the variant
				type: "json", // variant type
				options: {
					status: 200,
					body: {
						rows: [],
						pageNumber: 1,
						pageSize: 10,
						total: 0
					}
				}
			}
		]
	},
	{
		id: "get-user", // id of the route
		url: "/admin/api/identity-management-svc/control/external/get-users-by-ids", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const body = req.body
						const { userIds } = body

						const userRes = [users.find((user) => userIds.includes(user.id))]

						res.status(200)
						res.send({ users: userRes })
					}
				}
			},
			{
				id: "not-found", // id of the variant
				type: "status", // variant type
				options: {
					status: 404
				}
			}
		]
	},
	// {
	// 	id: "invite-user", // id of the route
	// 	url: "/admin/api/identity-management-svc/control/external/invite-user", // url in path-to-regexp format
	// 	method: "POST", // HTTP method
	// 	variants: [
	// 		{
	// 			id: "success", // id of the variant
	// 			type: "middleware", // variant type
	// 			options: {
	// 				middleware: (req, res, next, core) => {
	// 					core.logger.info("Request received!")
	// 					const createUserGroup = req.body

	// 					if (createUserGroup) {
	// 						userGroups.push({ ...createUserGroup, id: Math.max(...userGroups.map((a) => parseInt(a.id))) + 1 })
	// 						res.status(200)
	// 						res.send(apiMutation)
	// 					} else {
	// 						res.status(404)
	// 						res.send()
	// 					}
	// 				}
	// 			}
	// 		}
	// 	]
	// },
	{
		id: "delete-user", // id of the route
		url: "/admin/api/identity-management-svc/control/external/users/delete/:id", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const { id } = req.params

						const userGroupIndex = users.findIndex((userGroup) => userGroup.id === id)
						if (userGroupIndex >= 0) {
							users.splice(userGroupIndex, 1)
							res.status(200)
							res.send(apiMutation)
						} else {
							res.status(404)
							res.send()
						}
					}
				}
			}
		]
	}
]
