<?php
    require "pdoInit.php";

    $results = [];
    $results['personnel'] = [];

try {
    $sql = 
    'SELECT * FROM Members 
    JOIN Positions USING (memberId) 
    WHERE positionTitle IN ("GM", "GMC", "CQChair", "CQCommittee")';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $results['personnel'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $results['status'] = 'success';
} catch (PDOException $e) {
    $results['error'] =  $e->getMessage();
    $results['status']= 'fail';
}

echo json_encode($results);