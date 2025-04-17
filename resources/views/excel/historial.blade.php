<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Historial</title>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Usuario</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($historial as $item)
                <tr>
                    <td>{{ ucfirst($item->tipo) }}</td>
                    <td>{{ $item->nombre_producto ?? 'N/A' }}</td>
                    <td>{{ $item->descripcion }}</td>
                    <td>{{ $item->nombre_usuario ?? 'Sistema' }}</td>
                    <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d/m/Y H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
