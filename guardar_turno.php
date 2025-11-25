<?php
include_once("db/conexion.php");
$id_cliente = isset($_POST['id_usuario']);
$duracion = 45;

$sql="
SELECT id_cita FROM cita 
WHERE fecha = ? AND hora = ? AND id_recurso = ?;
";

if ($stmt = $pdo->prepare($sql)) {
    $stmt->execute([$_POST['fecha'], $_POST['hora'], $_POST['recurso']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode(["status" => "error", "message" => "El turno ya está reservado."]);
        exit;
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta."]);
    exit;
}
$sql = "
INSERT INTO cita (fecha, hora, id_recurso, id_cliente)
VALUES (?, ?, ?, ?);
";
if ($stmt = $pdo->prepare($sql)) {
    $stmt->execute([$_POST['fecha'], $_POST['hora'], $_POST['recurso'], $_POST['id_cliente']]);
    echo json_encode(["status" => "success", "message" => "Turno guardado correctamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar el turno."]);
}   
?>