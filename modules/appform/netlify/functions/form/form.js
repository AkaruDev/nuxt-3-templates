export default async (request) => {

  try {

    // Check method
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const formData = await request.formData()

    if (
      !formData.has('name') ||
      !formData.has('message')
    ) {
      return new Response('Required fields are missing.', { status: 422 })
    }

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.warn(error)
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
