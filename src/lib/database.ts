const database = new Map();


export function getWebringData(userid:number) {
	if (!database.has(userid)) {
		createTodo( userid, 'Learn about API routes' );
	}

	return Array.from(database.get(userid).values());
}

export function createTodo( userid:number, description:string ) {
	if (!database.has(userid)) {
		database.set(userid, new Map());
	}

	const todos = database.get(userid);

	const id = crypto.randomUUID();

	todos.set(id, {
		id,
		description,
		done: false
	});

	return {
		id
	};
}

export function toggleTodo( userid:number, id:number, done:boolean ) {
	const todos = database.get(userid);
	todos.get(id).done = done;
}

export function deleteTodo( userid:number, id:number ) {
	const todos = database.get(userid);
	todos.delete(id);
}
