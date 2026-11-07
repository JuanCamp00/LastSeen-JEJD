-- =========================================
-- LAST SEEN
-- DATOS INICIALES
-- EXPEDIENTE 001
-- =========================================

BEGIN;

-- 1. ACERTIJO: LA CANCELACION

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'En el material de presentación del equipo, ¿cuántas personas aparecen como integrantes responsables de desarrollar la secuela?',
    1,
    'SELECCION',
    NULL
)
ON CONFLICT (orden) DO NOTHING;


-- 2. OPCIONES DE RESPUESTA

INSERT INTO opcion_acertijo (
    id_acertijo,
    texto_opcion,
    orden,
    es_correcta
)
SELECT
    a.id_acertijo,
    opciones.texto_opcion,
    opciones.orden,
    opciones.es_correcta
FROM acertijo a
CROSS JOIN (
    VALUES
        ('2 integrantes', 1, FALSE),
        ('3 integrantes', 2, TRUE),
        ('4 integrantes', 3, FALSE),
        ('5 integrantes', 4, FALSE)
) AS opciones(texto_opcion, orden, es_correcta)
WHERE a.orden = 1
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. PISTA INICIAL

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Revisa la presentación pública del equipo. Cuenta a las personas que lo integraban, no las áreas de trabajo.',
    1,
    TRUE
FROM acertijo
WHERE orden = 1
ON CONFLICT (id_acertijo, orden) DO NOTHING;

-- =========================================
-- 4. CONTENIDO: PRESENTACION DEL EQUIPO
-- EXPEDIENTE 001
-- =========================================

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    NULL,
    'Presentación del equipo',
    'Documento público que presenta a los tres integrantes responsables del desarrollo de la secuela.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_001/presentacion_equipo.txt'
WHERE NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE titulo = 'Presentación del equipo'
      AND recurso = '/recursos/documentos/expediente_001/presentacion_equipo.txt'
);

-- =========================================
-- CONTENIDO: COMUNICADO DE CANCELACION
-- EXPEDIENTE 001
-- =========================================

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    NULL,
    'Comunicado oficial de cancelación',
    'Anuncio público mediante el cual el equipo informa la cancelación definitiva del proyecto.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_001/comunicado_cancelacion.txt'
WHERE NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE titulo = 'Comunicado oficial de cancelación'
);

COMMIT;