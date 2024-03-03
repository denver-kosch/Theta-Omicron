<?php

    require_once "pdoInit.php";

    $un = $_POST['username'];
    $password = $_POST['password'];

    try {
        $sql = 'SELECT * FROM Members WHERE email=:un';
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':un', $un);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        // If User and password verifies, successfully login
        if ($user) {
            $_SESSION['user'] = $user;
            header("Location: hall.php");
            exit;
        }

        throw new PDOException("Error Processing Request: Incorrect username/password");

    } catch (PDOException $e) {
        echo 'Error Finding User: '. $e->getMessage();
    }