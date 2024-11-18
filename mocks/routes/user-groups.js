const userGroups = require("../fixtures/user-groups")

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
		id: "get-user-groups-paginated", // id of the route
		url: "/admin/api/identity-management-svc/control/external/get-user-groups", // url in path-to-regexp format
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
							rows: userGroups.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
							pageNumber,
							pageSize,
							total: userGroups.length
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
		id: "get-user-group", // id of the route
		url: "/admin/api/identity-management-svc/control/external/user-groups/get-user-groups-by-ids", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const body = req.body
						const { userGroupIds } = body

						const userGroupRes = [userGroups.find((userGroup) => userGroupIds.includes(userGroup.id))]

						res.status(200)
						res.send(userGroupRes)
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
	{
		id: "create-user-groups", // id of the route
		url: "/admin/api/identity-management-svc/control/external/user-groups/create", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const createUserGroup = req.body

						if (createUserGroup) {
							userGroups.push({ ...createUserGroup, id: Math.max(...userGroups.map((a) => parseInt(a.id))) + 1 })
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
	},
	{
		id: "update-user-groups", // id of the route
		url: "/admin/api/identity-management-svc/control/external/user-groups/update/:id", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const updateUserGroup = req.body
						const userGroupId = req.params.id

						const userGroupIndex = userGroups.findIndex((user) => user.id === userGroupId)

						if (updateUserGroup && userGroupId && userGroupIndex >= 0) {
							userGroups[userGroupIndex] = { ...userGroups[userGroupIndex], ...updateUserGroup }
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
	},
	{
		id: "delete-user-groups", // id of the route
		url: "/admin/api/identity-management-svc/control/external/user-groups/delete/:id", // url in path-to-regexp format
		method: "POST", // HTTP method
		variants: [
			{
				id: "success", // id of the variant
				type: "middleware", // variant type
				options: {
					middleware: (req, res, next, core) => {
						core.logger.info("Request received!")
						const { id } = req.params

						const userGroupIndex = userGroups.findIndex((userGroup) => userGroup.id === id)
						if (userGroupIndex >= 0) {
							userGroups.splice(userGroupIndex, 1)
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
