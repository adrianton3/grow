(() => {
	'use strict'

	const { distance } = Vec2

	function makeChunks (resolution) {
		const matrix = []

		for (let i = 0; i < resolution; i++) {
			const line = []

			for (let j = 0; j < resolution; j++) {
				const chunk = []

				line.push(chunk)
			}

			matrix.push(line)
		}

		return matrix
	}

	function applyOnArea (
		{ chunks, halfWidth, chunkSize },
		sx, sy, ex, ey,
		fun
	) {
		const scx = Math.floor((sx + halfWidth) / chunkSize)
		const scy = Math.floor((sy + halfWidth) / chunkSize)

		const ecx = Math.floor((ex + halfWidth) / chunkSize)
		const ecy = Math.floor((ey + halfWidth) / chunkSize)

		for (let i = scx; i <= ecx; i++) {
			for (let j = scy; j <= ecy; j++) {
				fun(chunks[i][j])
			}
		}
	}

	function populateChunks (space, items) {
		items.forEach((item) => {
			applyOnArea(
				space,
				item.position.x - item.radius,
				item.position.y - item.radius,
				item.position.x + item.radius,
				item.position.y + item.radius,
				(chunk) => {
					chunk.push(item)
				}
			)
		})
	}

	function make (items, { resolution, halfWidth }) {
		const chunks = makeChunks(resolution)

		const space = {
			chunks,
			halfWidth,
			chunkSize: (halfWidth * 2) / resolution,
		}

		populateChunks(space, items)

		return space
	}

	function getOverlapping (space, that) {
		const collected = []

		function collect(chunk) {
			chunk.forEach((item) => {
				const dist = distance(item.position, that.position)

				if (
					dist < that.radius + item.radius &&
					that !== item
				) {
					collected.push(item)
				}
			})
		}

		applyOnArea(
			space,
			that.position.x - that.radius,
			that.position.y - that.radius,
			that.position.x + that.radius,
			that.position.y + that.radius,
			collect
		)

		return collected
	}

	self.Space = self.Space || {}
	Object.assign(self.Space, {
		make,
		getOverlapping
	})
})()