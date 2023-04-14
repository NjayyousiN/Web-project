export async function POST(request) {

    try {
        return new Response('Hello, upload route!')

    }  catch (err) {
            console.error(err.message);
            return Response({message: "Internal server error."}, { status: 500});
    }
}
 