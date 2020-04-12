<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $userA = $manager->getRepository(User::class)->
                    findOneByEmail('tienda@tienda.com');

        if (!$userA) {
        $user = new User();
        $user->setNombre('admin');
        $user->setMobile('0000');
        $user->setEmail('tienda@tienda.com');
        $user->setRoles(["ROLE_ADMIN"]);
        $password = $this->encoder->encodePassword($user, 'admin85204561583#');
        $user->setPassword($password);

        $manager->persist($user);
        $manager->flush();

        }
    }
}
