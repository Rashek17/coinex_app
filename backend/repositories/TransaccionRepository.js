class TransaccionRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async obtenerPorUsuario(idUsuario) {
        const result = await this.pool.query(
            `SELECT 
        id_transaccion, 
        id_usuario, 
        activo, 
        tipo, 
        cantidad, 
        precio_unitario, 
        fecha
       FROM transacciones
       WHERE id_usuario = $1
       ORDER BY fecha DESC`,
            [idUsuario]
        );

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;
    }
    async crear(datos) {
        const {
            usuario_id,
            activo,
            tipo,
            cantidad,
            precio_unitario
        } = datos;

        if (!usuario_id || !activo || !tipo || !cantidad || !precio_unitario) {
            throw new Error("Datos incompletos");
        }

        const tipoNormalizado = tipo.toUpperCase();

        // 1. Insertar la transacción
        const result = await this.pool.query(
            `INSERT INTO transacciones (id_usuario, tipo, activo, cantidad, precio_unitario, fecha)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [usuario_id, tipoNormalizado, activo, cantidad, precio_unitario]
        );

        // 2. Buscar si ya existe en portafolio
        const portafolio = await this.pool.query(
            "SELECT * FROM portafolio WHERE id_usuario = $1 AND activo = $2",
            [usuario_id, activo]
        );

        let cantidad_total = 0;
        let valor_promedio = 0;

        if (portafolio.rows.length > 0) {
            cantidad_total = parseFloat(portafolio.rows[0].cantidad_total);
            valor_promedio = parseFloat(portafolio.rows[0].valor_promedio);
        }

        // 3. Actualizar portafolio según tipo
        if (tipoNormalizado === "COMPRA") {
            const nuevaCantidad = cantidad_total + cantidad;
            const nuevoPromedio =
                (cantidad_total * valor_promedio + cantidad * precio_unitario) /
                nuevaCantidad;

            if (portafolio.rows.length > 0) {
                await this.pool.query(
                    "UPDATE portafolio SET cantidad_total = $1, valor_promedio = $2 WHERE id_usuario = $3 AND activo = $4",
                    [nuevaCantidad, nuevoPromedio, usuario_id, activo]
                );
            } else {
                await this.pool.query(
                    "INSERT INTO portafolio (id_usuario, activo, cantidad_total, valor_promedio) VALUES ($1, $2, $3, $4)",
                    [usuario_id, activo, cantidad, precio_unitario]
                );
            }
        } else if (tipoNormalizado === "VENTA") {
            const nuevaCantidad = cantidad_total - cantidad;

            if (nuevaCantidad < 0) {
                throw new Error("No tienes suficientes activos para vender");
            }

            const nuevoPromedio = nuevaCantidad === 0 ? 0 : valor_promedio;

            await this.pool.query(
                "UPDATE portafolio SET cantidad_total = $1, valor_promedio = $2 WHERE id_usuario = $3 AND activo = $4",
                [nuevaCantidad, nuevoPromedio, usuario_id, activo]
            );
        }

        return result.rows[0];
    }
}

module.exports = TransaccionRepository;