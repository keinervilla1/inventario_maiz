<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Historial de movimientos</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 20px;
        }

        .header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #555;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background-color: #f2f2f2;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 8px 6px;
            text-align: left;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .footer {
            margin-top: 30px;
            font-size: 11px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="title">📚 Historial de Movimientos</div>
    </div>

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
                    <td>{{ $item->created_at->format('Y-m-d H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Generado automáticamente por el sistema | {{ now()->format('Y-m-d H:i') }}
    </div>

</body>
</html>
