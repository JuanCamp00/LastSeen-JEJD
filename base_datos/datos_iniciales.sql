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

-- =========================================
-- EXPEDIENTE 002: LAS SEÑALES IGNORADAS
-- ACERTIJO DE TIPO TEXTO
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según la entrevista, ¿qué consideraba necesario el desarrollador backend para que el equipo pudiera tomar decisiones?',
    2,
    'TEXTO',
    'Que una persona tuviera la última palabra.'
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Presta atención a quién considera que debe asumir las decisiones definitivas, en lugar de buscar un acuerdo entre todos.',
    1,
    FALSE
FROM acertijo
WHERE orden = 2
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. Registrar la entrevista como contenido desbloqueable

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a1.id_acertijo,
    'Entrevista al desarrollador backend',
    'Transcripción de una entrevista promocional en la que el desarrollador habla sobre las decisiones dentro del equipo.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_002/entrevista_backend.txt'
FROM acertijo a1
WHERE a1.orden = 1
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_002/entrevista_backend.txt'
);

-- =========================================
-- EXPEDIENTE 003: UN PASADO OLVIDADO
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según el comunicado archivado, ¿cuál fue el motivo anunciado para la disolución del equipo anterior?',
    3,
    'SELECCION',
    NULL
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar las opciones

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
        ('Falta de financiación.', 1, FALSE),
        ('Diferencias internas sobre la dirección del proyecto.', 2, TRUE),
        ('El videojuego había sido completado.', 3, FALSE),
        ('El equipo fue adquirido por otra empresa.', 4, FALSE)
) AS opciones(texto_opcion, orden, es_correcta)
WHERE a.orden = 3
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Revisa el comunicado de cierre y presta atención a las razones que menciona el equipo para separarse.',
    1,
    FALSE
FROM acertijo
WHERE orden = 3
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 4. Registrar el documento desbloqueable

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a.id_acertijo,
    'Registro del proyecto anterior',
    'Fragmento recuperado del portafolio profesional del desarrollador backend sobre su antiguo equipo.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_003/registro_proyecto_anterior.txt'
FROM acertijo a
WHERE a.orden = 2
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_003/registro_proyecto_anterior.txt'
);

-- =========================================
-- EXPEDIENTE 004: LA ARTISTA DESAPARECIDA
-- ACERTIJO DE TIPO TEXTO
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según los registros encontrados, ¿qué tipo de trabajos dejó de compartir públicamente la artista después de la cancelación?',
    4,
    'TEXTO',
    'Sus ilustraciones y avances musicales.'
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Compara las publicaciones anteriores al anuncio con la última publicación que quedó archivada.',
    1,
    FALSE
FROM acertijo
WHERE orden = 4
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. Registrar el documento desbloqueable

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a.id_acertijo,
    'Archivo de publicaciones de la artista',
    'Recopilación de publicaciones anteriores y posteriores a la cancelación del proyecto.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_004/archivo_publicaciones_artista.txt'
FROM acertijo a
WHERE a.orden = 3
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_004/archivo_publicaciones_artista.txt'
);

-- =========================================
-- EXPEDIENTE 005: LO QUE LOS UNIA
-- ACERTIJO DE TIPO SELECCION
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según los registros encontrados, ¿qué vínculo existía entre la artista y el desarrollador frontend?',
    5,
    'SELECCION',
    NULL
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar las opciones

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
        ('Eran antiguos compañeros de universidad.', 1, FALSE),
        ('Mantenían una relación sentimental y trabajaban juntos.', 2, TRUE),
        ('Eran familiares.', 3, FALSE),
        ('Apenas tenían contacto profesional.', 4, FALSE)
) AS opciones(texto_opcion, orden, es_correcta)
WHERE a.orden = 5
ON CONFLICT (id_acertijo, orden)
DO UPDATE SET
    texto_opcion = EXCLUDED.texto_opcion,
    es_correcta = EXCLUDED.es_correcta;


-- 3. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'No te limites a revisar sus responsabilidades profesionales. Presta atención al fragmento de la nota personal.',
    1,
    FALSE
FROM acertijo
WHERE orden = 5
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 4. Registrar el documento desbloqueable

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a.id_acertijo,
    'Registro de colaboración creativa',
    'Documento interno que muestra la estrecha colaboración entre la artista y el desarrollador frontend.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_005/registro_colaboracion.txt'
FROM acertijo a
WHERE a.orden = 4
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_005/registro_colaboracion.txt'
);

-- =========================================
-- EXPEDIENTE 006: DETRAS DEL PROYECTO
-- ACERTIJO DE TIPO TEXTO
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según los registros recuperados, ¿qué situación dificultaba constantemente la colaboración entre los dos desarrolladores?',
    6,
    'TEXTO',
    'Sus desacuerdos constantes sobre las decisiones técnicas del proyecto.'
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Compara las intervenciones de ambos desarrolladores durante la reunión y observa qué problema nunca consiguieron resolver.',
    1,
    FALSE
FROM acertijo
WHERE orden = 6
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. Registrar el documento desbloqueable

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a.id_acertijo,
    'Registro de conflictos del equipo',
    'Fragmentos de reuniones y notas internas que muestran los desacuerdos profesionales entre los desarrolladores.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_006/registro_conflictos_equipo.txt'
FROM acertijo a
WHERE a.orden = 5
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_006/registro_conflictos_equipo.txt'
);

-- =========================================
-- EXPEDIENTE 007: LA ULTIMA PIEZA
-- ACERTIJO DE TIPO TEXTO
-- =========================================

-- 1. Registrar el acertijo

INSERT INTO acertijo (
    pregunta,
    orden,
    tipo_validacion,
    respuesta_correcta_texto
)
VALUES (
    'Según los registros recuperados, ¿qué ocurrió con la actividad verificable de la cuenta del desarrollador backend después de aquella última noche?',
    7,
    'TEXTO',
    'No se registró actividad verificable posterior de su cuenta.'
)
ON CONFLICT (orden) DO NOTHING;


-- 2. Registrar la pista

INSERT INTO pista (
    id_acertijo,
    contenido,
    orden,
    disponible_desde_inicio
)
SELECT
    id_acertijo,
    'Compara la última actividad del backend con los registros posteriores. Recuerda que una ausencia de registros no demuestra por sí sola qué ocurrió.',
    1,
    FALSE
FROM acertijo
WHERE orden = 7
ON CONFLICT (id_acertijo, orden) DO NOTHING;


-- 3. Registrar el documento final

INSERT INTO contenido (
    id_acertijo_desbloqueador,
    titulo,
    descripcion,
    tipo_contenido,
    recurso
)
SELECT
    a.id_acertijo,
    'Últimos registros del proyecto',
    'Recopilación de los últimos registros de actividad, notas personales y declaraciones relacionadas con la desaparición del desarrollador backend.',
    'DOCUMENTO',
    '/recursos/documentos/expediente_007/ultimo_registro_recuperado.txt'
FROM acertijo a
WHERE a.orden = 6
AND NOT EXISTS (
    SELECT 1
    FROM contenido
    WHERE recurso = '/recursos/documentos/expediente_007/ultimo_registro_recuperado.txt'
);

COMMIT;