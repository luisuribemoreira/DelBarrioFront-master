export default function ({ redirect, route }) {
  if (route.path.match(/\/undefined$/i)) {
    return redirect('/')
  }
}
