import { FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'

export async function fetchSessionToken(token: string): Promise<string> {
	const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
		`
		SELECT *
		FROM sessions
		WHERE token = ?
		`,
		[token]
	)
	return rows.length ? rows[0].token : undefined
}

export async function deleteSessionToken(token: string) {
	await db.execute(`DELETE FROM sessions WHERE token = ?`,[token])
}