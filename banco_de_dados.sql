
CREATE DATABASE IF NOT EXISTS biblioteca_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE biblioteca_db;

CREATE TABLE IF NOT EXISTS livros (
  id             INT          NOT NULL AUTO_INCREMENT,
  titulo         VARCHAR(255) NOT NULL,
  autor          VARCHAR(255) NOT NULL,
  isbn           VARCHAR(20)  NOT NULL UNIQUE,
  genero         VARCHAR(100) NOT NULL,
  ano_publicacao INT          NOT NULL,
  paginas        INT              NULL,
  sinopse        TEXT             NULL,
  criado_em      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO livros (titulo, autor, isbn, genero, ano_publicacao, paginas, sinopse) VALUES
('Dom Casmurro',              'Machado de Assis',       '978-85-359-0277-0', 'Romance',       1899, 256, 'A história de Bentinho e Capitu, marcada pelo ciúme e pela dúvida, um dos maiores clássicos da literatura brasileira.'),
('O Cortiço',                 'Aluísio Azevedo',        '978-85-359-0278-7', 'Naturalismo',   1890, 272, 'Retrato da vida coletiva num cortiço do Rio de Janeiro do século XIX, com forte crítica social.'),
('Vidas Secas',               'Graciliano Ramos',       '978-85-359-0279-4', 'Romance',       1938, 176, 'A saga de uma família de retirantes nordestinos que luta pela sobrevivência no sertão castigado pela seca.'),
('Grande Sertão: Veredas',    'João Guimarães Rosa',    '978-85-359-0280-0', 'Romance',       1956, 608, 'Monólogo do jagunço Riobaldo, que narra sua vida no sertão mineiro e um suposto pacto com o diabo.'),
('Capitães da Areia',         'Jorge Amado',            '978-85-359-0281-7', 'Romance',       1937, 328, 'A história de um grupo de crianças abandonadas que vivem nas ruas de Salvador e lutam pela sobrevivência.'),
('A Hora da Estrela',         'Clarice Lispector',      '978-85-359-0282-4', 'Novela',        1977, 88,  'A trajetória de Macabéa, uma jovem nordestina que vive no Rio de Janeiro, narrada com profundidade existencial.'),
('O Guarani',                 'José de Alencar',        '978-85-359-0283-1', 'Romantismo',    1857, 384, 'O amor impossível entre o índio Peri e a jovem branca Ceci, em plena floresta brasileira do século XVII.'),
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', '978-85-359-0284-8', 'Romance',      1881, 264, 'Narradas pelo próprio defunto-autor Brás Cubas, as memórias irônicas de um homem da elite carioca do Segundo Reinado.'),
('Sagarana',                  'João Guimarães Rosa',    '978-85-359-0285-5', 'Contos',        1946, 328, 'Nove contos ambientados no sertão mineiro, que mesclam realismo e fantasia com linguagem inventiva.'),
('Iracema',                   'José de Alencar',        '978-85-359-0286-2', 'Romantismo',    1865, 160, 'O amor trágico entre a índia Iracema e o guerreiro português Martim, considerado o mito fundador do Ceará.');
